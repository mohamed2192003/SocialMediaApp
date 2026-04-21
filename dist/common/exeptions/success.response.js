export const SuccessResponse = ({ res, message = "Success", status = 200, data }) => {
    return res.status(status).json({ message, data });
};
