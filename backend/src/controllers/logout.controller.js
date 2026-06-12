const controller = {};

controller.logout = async (req, res) =>{
    try {
        res.clearCookie("authCookie");
        return res.status(200).json({message: "Sesión cerrada"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export default controller;