export const handleGlobalErrors = (err, req, res, next) => {
    console.log('Global Error Handler invoke!')
    if (err) {
        if (res.headersSent) {
            return next(err);
        }
        return res.status(err.status || 500).json({ success: false, error: err.message })
    }

    return next()
}