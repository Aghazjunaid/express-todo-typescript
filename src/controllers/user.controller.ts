import { Request, Response } from 'express';
import { hashSync, compare, genSaltSync } from 'bcryptjs';
import { User, UserInput } from '../models/user.model';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

export const SECRET_KEY: Secret = 'your-secret-key-here';

export const Signup = async (req: Request, res: Response) => {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({ message: 'The fields email, fullName, password are required' });
    }

    const salt = genSaltSync(10);
    const userInput: UserInput = {
      fullName,
      email,
      password: hashSync(password, salt),
    };

    const userCreated = await User.create(userInput);

    return res.status(200).json({ data: userCreated });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'The fields email, password are required' });
    }

    const user : any = await User.findOne({ email: email }).exec();
    if (user) {
      const isMatch = await compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'invalid login details' });
      }

      const token = jwt.sign({ _id: user._id?.toString(), email: user.email }, SECRET_KEY, {
        expiresIn: '2 days',
      });
      
      return res.status(200).json({ data: user, token });
    }

    return res.status(400).json({ message: 'invalid email and password' });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};