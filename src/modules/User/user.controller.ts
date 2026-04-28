// router.patch('/update-user',auth, multerLocal ().single('image'), async(req, res)=>{
//     let data = await updateUser(req.userId, req.body, req.file)
//     console.log(req.userId, "from user controller");
    
//     return SuccessResponse({res, message:'User Updated Successfully', status:200, data})
// })
// router.delete('/delete-user', async(req, res)=>{
//     let data = await deleteUser(req.userId)
//     return SuccessResponse({res, message:'User Deleted Successfully', status:200, data:data})
// })