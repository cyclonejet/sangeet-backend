import { DataTypes } from 'sequelize';
import { sequelize } from '../../bin/initializeDB';

const User = sequelize.define('User', {
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
});

export default User;
