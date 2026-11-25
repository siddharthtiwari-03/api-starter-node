export const handle404Error = (req, res, _next) => {
    console.error('Custom 404: Path not found', req.originalUrl, req.path, req.query, req.params)
    res.status(404).json({ success: false, error: 'End-point not found!' })
}