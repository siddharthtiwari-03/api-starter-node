// Internal dependencies start here
const { User } = require('../../models/user.class')
const { prettifyError, applyPagination, applySort, applySearch, applyRange, applyFilters } = require('../../services/helper.service')
// Internal dependencies end here

const getAllUsers = async (req, res) => {

    /**
     * @type {object}
     * @prop {number} page - The page number for pagination.
     * @prop {number} pageSize - The number of items per page.
     * @prop {string} search - Search term to filter users by name / description / email etc
     * @prop {'latest'|'oldest'|'az'|'za'} sort - Sorting criteria for the users list, default is 'latest'.
     * @prop {'week'|'month'|'year'} range - Range filter for createdOn field, e.g., 'week', 'month', 'year'.
     * @prop {object} filters - Additional filters to apply on the users list.
     */
    const { page, pageSize, search, sort = 'latest', range, ...filters } = req.query

    // Get list of users
    const found = await User.find({
        where: {
            ...applySearch(search, ['firstName', 'lastName', 'userDes', 'userEmail']),
            ...applyRange(range, 'createdOn'),
            ...applyFilters(filters)
        },
        ...applyPagination({ page, pageSize }),
        ...applySort(sort, 'firstName', 'userId'),
        debug: 'query' // remove this in production
    })

    if (!found.success) {
        console.error('Error loading users list:', found)
        return res.status(400).json(prettifyError(found))
    }

    return res.success(200).json(found) // Return the users list
}

module.exports = { getAllUsers }