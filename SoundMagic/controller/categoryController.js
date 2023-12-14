const Category = require('../model/categoryModel')


const loadCategories = async(req,res)=>{
    try {
        const categories = await Category.find();
        res.render('categories', { categories });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}

const addCategories = async (req, res) => {

    try {
     
        const name =req.body.name;
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

        const copy = await Category.findOne({name:formattedName});
        if(copy){
            return res.status(400).json({ error: 'Category already exists' });
        }
          const newCategory = new Category({
              name : formattedName,
              isListed:true
  
          });
        const data =  await newCategory.save();
        if(data){
          res.redirect('/categories')
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
        
    }

    
};

const loadEditCategories = async(req,res)=>{
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        res.render('editCategory',{category})
        
    } catch (error) {
        
    }
}

const editCategories = async(req,res)=>{
    const categoryId = req.params.id;
    const updateName = req.body.name;
try {
   
    const category = await Category.findById(categoryId);
     category.name = updateName;
     await category.save();
     res.redirect('/admin/categories')
} catch (error) {
    
}

}

const listCategory = async(req,res)=>{
    try {

        const id = req.params.id
        const category = await Category.findOne({ _id: id })
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        category.isListed = true;
        await category.save()
        res.json({ message: 'Category listed successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }

}

const unlistCategory = async(req,res)=>{
    try {

        const id = req.params.id

        const category = await Category.findOne({ _id: id })
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        category.isListed = false;
        await category.save()
        res.json({ message: 'Category Unlisted successfully' })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });

    }

}


module.exports = {
    loadCategories,
    addCategories,
    loadEditCategories,
    editCategories,
    listCategory,
    unlistCategory
}