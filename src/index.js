import express from 'express';
const app = express();
const NodeCache = require( "node-cache" );
const insertItem = require('./DatabaseCon/db');
const logger = require('./logger');
const localMaxKeys = 2;
const myCache = new NodeCache({maxKeys: localMaxKeys});
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//this function is used for the generation of random string

function generateString(length) {
  let result = ' ';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//This function is used to set items in cache and insert them into database

function updateCache(key, item){
  myCache.set(key,item,10);
  insertItem({"key ": key, "Value ": item})
  .then(() => {
     console.log("item is successfully inserted");
    })
    .catch((err) => {
      console.log(err)
    })
  }

//Add an endpoint that returns the cached data for a given key

app.get('/Cache/:key', async (req, res) => {
  try {
    const key = req.params.key;
    //getting the cache_data from the cache
    let cache_data = myCache.get(key);
    // if Cache_data does not exist in the cache, create it and store it in the cache
    if (cache_data == null) 
    {
      logger.info("Cache Miss");
      let randomString= generateString(5);
      if (((myCache.keys()).length < localMaxKeys))
      {
      updateCache(key,randomString);
      }
      else
      {
        myCache.flushAll();
        updateCache(key,randomString);

      }
      let data = "Updating the Cache with : "+ JSON.stringify ({"key ": key, "Value ": randomString});
      return res.status(200).send(data);
    }
    logger.info("Cache hit");
    let data ="Getting data from the Cache"+ JSON.stringify ({"key ": key, "Value ": cache_data});
    return res.status(200).send(data);
  } 
  catch (err) 
  {
    console.log(err);
    res.sendStatus(500);
  }
});

//An endpoint that returns all stored keys in the cache

app.get('/Allkeys', async (req, res) => {
  try {
    let keys = myCache.keys();
    if (keys.length != 0)
    {
    let data = "Getting all keys from the cache " + JSON.stringify(keys) ;
    return res.status(200).send(data);}
    else 
    {
      return res.status(200).send({message:"No keys found in the cache"});
    }
  } 
  catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

 //an endpoint that removes a given key from the cache

 app.delete("/:key",(req,res)=>{
  try
  {
  const key = req.params.key;
  if (myCache.keys().includes(key))
  {
    myCache.del(key);
    let data = key + " : This key is deleted from cache ";
    return res.status(200).send(data);
  }
  else
  {
    let data = key + ": This key is not found in Cache"
    return res.status(200).send(data);}
  }
  catch(err){
    console.log(err);
    res.sendStatus(500);
  }
 })

  //an endpoint that removes all keys from the cache

  app.delete("/Cache/deleteAll",(req,res)=>{
    try
    {
      let keys = myCache.keys();
      if (keys.length != 0){
      keys.forEach((key) => {myCache.del(key);})
      res.status(200).send({message:"All cached keys are deleted"});
    }
    else
    {
      return res.status(200).send({message:"No keys found in the cache"});
    }
  }
    catch(err){
      console.log(err);
      res.sendStatus(500);
    }})
    
    
    //Add an endpoint that creates and updates the data for a given key

    app.put("/:key",(req,res)=>{
      try{
        const key = req.params.key;
        if (myCache.keys().includes(key)){
          let randomString = generateString(5);
          if ((myCache.keys()).length < localMaxKeys){
          updateCache(key,randomString);
          }
          else {
            myCache.flushAll();
            updateCache(key,randomString);
          }
            let data = "Element with "+ key + " is updated: "+ JSON.stringify ({"key ": key, "Value ": myCache.get(key)}) ;
            return res.status(200).send(data);
          }
          else
          {
            let randomString = generateString(5);
            if ((myCache.keys()).length < localMaxKeys){
            updateCache(key,randomString);}
            else {
            myCache.flushAll();
            updateCache(key,randomString);
            }
            let data = "Element with "+ key+ " is created" + JSON.stringify ({"key ": key, "Value ": myCache.get(key)});
            return res.status(200).send(data);
          }
        }
        catch(err){
        console.log(err);
        res.sendStatus(500);
      }})


// Start server with port 3000
app.listen(3000, function(){
    console.log("Server started on localhost:3000");
});