import { User, UserRole } from "../entities/user.entity";

export interface UserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export interface UserRepository {
  create(user: UserDTO): Promise<User>;
  // findById(id: string): Promise<User | null>;
  // update(id: string, data: Partial<User>): Promise<User | null>;
  // delete(id: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
}