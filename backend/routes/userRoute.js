import express from 'express';


const userRouter = express.Router();
userRouter.get('/:id', verifyToken, getUser);

export default userRouter;
