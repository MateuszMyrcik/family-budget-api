import mongoose from 'mongoose';

export const getConnection = () => {
  return mongoose.connections.find((conn) => conn.db);
};

export const clearCollection = async (collectionName: string) => {
  const connection = getConnection();
  await connection.collections[collectionName].deleteMany({});
};

export const getCollection = async (collectionName: string) => {
  const connection = getConnection();
  return connection.collections[collectionName];
};

export const appendDataToCollection = async (
  collectionName: string,
  data: any,
) => {
  const connection = getConnection();
  await connection.collections[collectionName].insertMany(data);
};
