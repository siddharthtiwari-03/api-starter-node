const methods = Object.freeze({
    all: { GET: true, PUT: true, PATCH: true, UPDATE: true, OPTIONS: true, POST: true, DELETE: true },
    reserved: { GET: true, PUT: true, PATCH: true, UPDATE: true, OPTIONS: true, POST: true, DELETE: false },
    protected: { GET: true, PUT: true, PATCH: true, UPDATE: true, OPTIONS: true, POST: false, DELETE: false },
    readOnly: { GET: true, PUT: false, PATCH: false, UPDATE: false, OPTIONS: false, POST: false, DELETE: false },
    none: { GET: false, PUT: false, PATCH: false, UPDATE: false, OPTIONS: false, POST: false, DELETE: false }
})

const accessControls = Object.freeze({
    super: {
        super: methods.reserved,
        user: methods.none
    },
    user: {
        super: methods.all,
        user: methods.reserved
    }
})

/**
 * @function checkAccess
 * @description Middleware to check if the accessor has permission to access the 'resource'
 * @param {string} resource - The resource to check access for
 * @returns {function} Middleware function
 * @author Siddharth Tiwari
 */
const checkAccess = resource => {
    return (req, res, next) => {
        console.info(`firewall checkAccess invoked, resource: ${resource}`)

        const { accessor } = req.locals

        if (!(accessor?.accessRole in accessControls)) {
            console.error(`firewall checkAccess failed, invalid accessRole: ${accessor?.accessRole}`)
            return res.status(403).json({ success: false, error: 'Access denied! Invalid access role' })
        }

        return next()
    }
}