// export const updateUser = async (userId, data, file) => {
//     const existUser = await findOne({
//         model: userModel,
//         filter: { id: userId }
//     })
//     set({
//         key: redisKey(userId),
//         value:  '',
//         ttl: 0
//     })
//     if (!existUser) {
//         throw BadRequestException({ message: 'User not found' })
//     }
//     if (file) {
//         data.imageProfileURL = `${env.baseURL}/uploads/${file.filename}`
//     }
//     const updatedUser = await findOneAndUpdate({
//         model: userModel,
//         filter: { id: userId },
//         data,
//         options: { new: true }
//     })
//     if (!updatedUser) {
//         throw BadRequestException({ message: 'Failed to Update User' })
//     }
//     return updatedUser
// }
// export const deleteUser = async (userId) => {
//   const userData = await findOneAndDelete({ model: userModel, filter: { id: userId } });
//   if (!userData) {
//     return NotFoundException({ message: "User Not Found" });
//   }
//   return { message: "User Deleted Successfully" };
// };