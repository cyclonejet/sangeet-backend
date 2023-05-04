import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../bin/initializeDB';

interface UserType
  extends Model<
    InferAttributes<UserType>,
    InferCreationAttributes<
      UserType,
      {
        omit:
          | 'id'
          | 'profilePicture'
          | 'liked'
          | 'createdPlaylists'
          | 'followedPlaylists'
          | 'followedArtists'
          | 'preference';
      }
    >
  > {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  liked: string[];
  createdPlaylists: string[];
  followedPlaylists: string[];
  followedArtists: string[];
  preference: 'opus' | 'flac';
}

const User = sequelize.define<UserType>('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.CHAR,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.CHAR,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.CHAR,
    allowNull: true,
  },
  liked: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    defaultValue: [],
  },
  createdPlaylists: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    defaultValue: [],
  },
  followedPlaylists: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    defaultValue: [],
  },
  followedArtists: {
    type: DataTypes.ARRAY(DataTypes.CHAR),
    defaultValue: [],
  },
  preference: {
    type: DataTypes.CHAR(4),
    defaultValue: 'opus',
  },
});

export default User;
