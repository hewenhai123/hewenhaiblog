var express = require('express');
var articleModel = require('../model/article');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/images')
    },
    filename: function (req, file, cb) {
        console.error(file);
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
})

var upload = multer({ storage: storage })

router.get('/add',function(req,res){
  res.render('article/add',{article:{}});
});

router.post('/add',upload.single('img'),function(req,res){
   var article = req.body;
   var _id = article._id;
   if(_id){
       var set = {title:article.title,content:article.content};
       if(req.file){
           set.img = '/images/'+req.file.filename;
       }
       articleModel.update({_id:_id},{$set:set},function(err,article){
           if(err){
               req.flash('error','更新文章失败');
               return res.redirect('back');
           }else{
               req.flash('success','更新文章成功');
               return res.redirect('/');
           }
       });
   }else{
       if(req.file){
           article.img = '/images/'+req.file.filename;
       }
       var user =  req.session.user;
       article.user = user;
       articleModel.create(article,function(err,article){
           if(err){
               req.flash('error','发表文章失败');
               return res.redirect('back');
           }else{
               req.flash('success','发表文章成功');
               return res.redirect('/');
           }
       });
   }
});


router.get('/detail/:_id',function(req,res){
    articleModel.findById(req.params._id,function(err,article){
        res.render('article/detail',{article:article});
    });
});


router.get('/delete/:_id',function(req,res){
    articleModel.remove({_id:req.params._id},function(err,result){
        if(err){
            req.flash('error','删除失败');
            res.redirect('back');
        }else{
            req.flash('success','删除成功');
            res.redirect('/');
        }
    });
});


router.get('/update/:_id',function(req,res){
    articleModel.findById(req.params._id,function(err,article){
        res.render('article/add',{article:article});
    });
});

module.exports = router;
