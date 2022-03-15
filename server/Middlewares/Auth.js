import jwt from "jsonwebtoken";

const secret = process.env.SECRET;

const Auth = async (req, res, next) => {
    try {
        const authorization = req?.headers?.authorization;
        if (authorization){
            try {
                const token = authorization.split(" ")[1];
                let decodedData;
                if(token.length < 500 ) {
                    try {
                        decodedData = jwt.verify(token, secret);
                        req.userId = decodedData?.id;
                        next();
                    } catch (error) {
                        console.log(error)
                        res.status(203).json({ message :"Token Error", error: error});
                    }
                }
                else {
                    try {
                        decodedData = jwt.decode(token);
                        req.userId = decodedData?.sub;
                        next();
                    } catch (error) {
                        console.log(error)
                        res.status(203).json({ message :"Token Error", error: error});
                    }
                }
            } catch (error) {
                res.status(203).json({ message :"Authorization Error", error: error});
            }
            
            
        }
        else {
            res.status(400).json({ message :"Unauthorized"});
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message :"Unknown Error", error: error});
    }
        
}

export default Auth;