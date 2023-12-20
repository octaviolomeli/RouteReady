// Desc: Check if user is authenticated
// Params: None
// Returns: A middleware function that checks if the user is authenticated

module.exports = (req, res, next) => {
    if (req.isAuthenticated()) { return next() }
    res.json({error: "Not authenticated"})
}