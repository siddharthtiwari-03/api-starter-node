const { generate_get_url } = require("./aws-s3.service")
const { envs } = require("./environment.service")

/**
 * Helps skip a middleware for any matching routes
 * @function skipFor
 * @description This function will skip the specified 'middleware' function if the requested path matches any one of the excluded 'paths' else executes the 'middleware' function before proceeding to the actual handler function
 * @param {*} middleware middleware function that needs to be skipped, if requested path exists in the excluded 'paths' or executed if requested path is not in the list of excluded 'paths'
 * @param {string[]} paths list of paths for which the provided 'middleware' function will not be executed and context will directly move to the handler function
 * @returns {*} context if 'middleware' function will be executed or skipped
 * @author Siddharth Tiwari
 */
const skipFor = (middleware, paths) => (req, res, next) => paths.some(element => req.path.includes(element)) ? next() : middleware(req, res, next)

/**
 * This function generates random code
 * @function generateCode
 * @description This function will generate random alpha numeric code with the number of characters provided in the parameter
 * @param {number} length number of characters that needs to be in the generated code
 * @returns {string} generated alpha numeric code
 * @author Siddharth Tiwari
 */
function generateCode(length) {
    const alphaNum = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z', '0', 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let code = ''

    for (let i = 0; i < length; i++) {
        code += alphaNum[Math.floor(Math.random() * alphaNum.length)]
    }
    return code
}

/**
 * This function helps apply pagination
 * @function applyPagination
 * @description This function will patch 'limit' and 'offset' parameters to the 'findObj' received in the parameter if both 'limit' and 'offset' are valid numbers. This function is originally designed to work with 'UnSQL'
 * @param {number} page starting index number for the records to be pulled out
 * @param {number} pageSize number of records that will be pulled out
 * @returns {object} returns the 'findObj' received in the parameter
 * @author Siddharth Tiwari
 */
const applyPagination = (page, pageSize) => {
    const limit = parseInt(pageSize)
    const pg = parseInt(page)
    return ({ ...(!isNaN(limit) && { limit }), ...(!isNaN(limit) && !isNaN(pg) && { offset: (pg - 1) * limit }) })
}

/**
 * @function applySearch
 * @description patch text search
 * @param {string} search text to be searched
 * @param {Array} columns search text in columns
 * @returns 
 */
const applySearch = (search, columns = []) => {
    if (!search) return {}
    const or = []
    for (let i = 0; i < columns.length; i++) {
        or.push({ [columns[i]]: { like: `#${search}` } })
    }
    return { or }
}

const applySort = (sort, columnName, tieBreaker = '', dateColumn = 'createdOn') => {
    const orderBy = {}
    switch (sort) {
        case 'az':
            orderBy[columnName] = 'asc'
            if (tieBreaker) orderBy[tieBreaker] = 'asc'
            return { orderBy }
        case 'za':
            orderBy[columnName] = 'desc'
            if (tieBreaker) orderBy[tieBreaker] = 'desc'
            return { orderBy }
        case 'oldest':
            orderBy[dateColumn] = 'asc'
            if (tieBreaker) orderBy[tieBreaker] = 'asc'
            return { orderBy }
        case 'latest':
        default:
            orderBy[dateColumn] = 'desc'
            if (tieBreaker) orderBy[tieBreaker] = 'desc'
            return { orderBy }
    }
}

const applyRange = (range, column) => {
    switch (range) {
        case 'week':
            return {
                date: {
                    value: column,
                    format: 'w Y',
                    compare: {
                        eq: {
                            date: {
                                value: 'currentDate',
                                format: 'w Y'
                            }
                        }
                    }
                }
            }
        case 'month':
            return {
                date: {
                    value: column,
                    format: 'M Y',
                    compare: {
                        eq: {
                            date: {
                                value: 'currentDate',
                                format: 'M Y'
                            }
                        }
                    }
                }
            }
        case 'year':
            return {
                date: {
                    value: column,
                    format: 'Y',
                    compare: {
                        eq: {
                            date: {
                                value: 'currentDate',
                                format: 'Y'
                                // sub: '1y'
                            }
                        }
                    }
                }
            }

        default:
            return {}
    }
}

const applyFilters = (filters) => {
    const condition = {}
    const entries = Object.entries(filters)
    for (let i = 0; i < entries.length; i++) {
        if (!entries[i][1]) continue
        condition[entries[i][0]] = entries[i][1].split(',').map(filter => Number(filter) ? filter : `#${filter}`) || []
    }
    return condition
}

/**
 * Matches string with regex pattern
 * @function matchRegex
 * @description This function will check if the provided string and the pattern matches or not
 * @param {*} str any string that needs to be matched against the pattern
 * @param {*} pattern string pattern that will be used to match the string
 * @returns {boolean} boolean representing if the string matches the pattern or not
 * @author Siddharth Tiwari
 */
const matchRegex = (str, pattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[89AB][a-f0-9]{3}-[a-f0-9]{12}/i) => RegExp(pattern).exec(`'${str}'`)

/**
 * Matches the request parameters with regex pattern
 * @function matchParamRegex
 * @description This is a middleware function that will check each of the parameter in the list of request 'params' against the 'pattern' and only allow the request to access the handler function if 'param' matches the 'pattern', else the request will be jumped to the next available route handler and this handler will be skipped
 * @param {*} params list of parameters that needs to be checked
 * @param {*} pattern string pattern against which the list of parameters will be checked
 * @returns {*} context if the request handler will be accessed or skipped
 * @author Siddharth Tiwari
 */
const matchParamRegex = (params = [], pattern) => {
    return (req, res, next) => {

        for (const param of params) {
            if (!req.params[param]) {
                console.error('param not in req.params')
                return res.status(422).json({ success: false, error: `Invalid Request! Unknown variable '${param}' in the request URL params` })
            }

            if (!matchRegex(req.params[param], pattern)) {
                console.error('regex not matching, skipping to next route')
                return next('route')
            }

        }

    }
}

/**
 * prettifies the error
 * @function prettifyError
 * @description This method cleans the error response and extracts only the error message from different types error objects. Used in sending clean error acknowledgement as API response
 * @param {*} e error object
 * @returns {{success:false, error:string}} simplified error acknowledgement along with the error message
 * @author Siddharth Tiwari
 */
const prettifyError = e => ({ success: false, error: e?.error?.sqlMessage || e?.error?.message || e?.error })

/**
 * patches inline string values
 * @function patchInline
 * @description This function will patch any sting / number / boolean value based on the 'condition'. Takes in two values each for if 'condition' is true or false. 
 * @param {*} condition used to determine which value will be patched, if 'condition' is true, 'patchValue' is patched else 'elseValue' is patched 
 * @param {*} patchValue value that will be patched if the 'condition' is true
 * @param {*} [elseValue] value that will be patched if the 'condition' is false
 * @returns {*} value that will be patched
 * @author Siddharth Tiwari
 */
const patchInline = (condition, patchValue, elseValue = '') => (condition && condition != undefined) ? patchValue : elseValue

/**
 * patches presigned URLs for files in AWS S3 bucket
 * @param {*} obj object into which the URLs need to be patched into
 * @param {*} columnName name of the column that represents AWS S3 bucket key
 * @param {*} signedName name provided to the generated signed URL, default is 'signedURL'
 * @returns {*} original object with patched signed URL + Cloudfront CDN URL
 * @author Siddharth Tiwari
 */
const addPresignedURL = async (obj, columnName = 'coverURL', signedName = 'signedURL') => {
    console.log('obj', obj)
    if (!obj) return
    if (obj[columnName] && !obj[columnName].includes('http')) {
        const presigner = await generate_get_url({ Key: obj[columnName] })

        console.log('presigner', presigner)
        if (presigner.success) obj[signedName] = presigner.signedURL
        if (envs?.aws?.cloudfront?.cdn_url && !obj[columnName].includes('http')) obj['cdn_' + columnName] = encodeURI(envs.aws.cloudfront.cdn_url + obj[columnName])
    }
}

const debugRequest = (req) => {
    console.log('Request Method:', req.method)
    console.log('Request URL:', req.originalUrl)
    console.log('Request agent:', req.headers['user-agent'])
}

module.exports = {
    skipFor,
    generateCode,
    applyPagination,
    applySearch,
    applySort,
    applyRange,
    applyFilters,
    matchRegex,
    matchParamRegex,
    prettifyError,
    patchInline,
    addPresignedURL,
    debugRequest
}