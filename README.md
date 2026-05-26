# Dependencies  

_From_ **(../uci-inf124-sp26-naaa/meet/app)** _run in the terminal_:  
```
$ npm install
```

# MongoDB Connection  

## Connecting to Cluster

On the sidebar under "Security", go to "Database & Network Access". In "IP Access List" under "Network Access", click on "Add IP Address". In "Access List Entry", enter your current IP address. In "Comment", enter your name and general location. You are ready to "Confirm". Note: Your IP address will likely differ between locations so make sure it is added whenever you are coding. 

## Retrieving DB User Information  

On the sidebar under "Security", go to "Database & Network Access". In "Database Users" under "Database Access", click on "Add New Database User". Using the "Password" authentication method, enter a username and autogenerate secure password, and store both of them for when updating the environment variables **<db_user>** and **<db_user_password>** respectively. In "Built-in Role" under "Database User Privileges", click on "Add Built In Role". Select "Atlas admin" for CRUD operations. You are ready to "Add User".   

## Updating Environment Variables  

In the .env file, replace **<db_user>** and **<db_user_password>** in ```MONGODB_URI``` with the information related to your DB user. Note: The ```appName=meet``` is the same for all users since we are sharing the database/cluster.

```
# MongoDB (database)
MONGODB_URI=mongodb+srv://<db_user>t:<db_user_password>@meet.7omwypj.mongodb.net/meet?retryWrites=true&w=majority&appName=meet

# Google API
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<ethan's>
GOOGLE_CLIENT_SECRET=<ethan's>
```

## Testing Database Connection   

_From_ **(../uci-inf124-sp26-naaa/meet/app)** _run in the terminal_:    
```
$ npm run dev:test-connect
```
You should see...  
```
✅ MongoDB connected
🎉 Connection test successful
```

## Testing CRUD Operations in Database  

_From_ **(../uci-inf124-sp26-naaa/meet/app)** _run in the terminal_:    
```
$ npm run dev:test-crud
```
You should something like... (Note: The ellipses means it could vary between users.)  
```
✅ MongoDB connected
CREATE:
{
  name: 'Jane Doe',
  email: 'jdoe@example.com',
  _id: new ObjectId('...'),
  createdAt: ...,
  updatedAt: ...,
  __v: 0
}

READ:
[
  {
    _id: new ObjectId('...'),
    name: 'Jane Doe',
    email: 'jdoe@example.com',
    createdAt: ...,
    updatedAt: ...,
    __v: 0
  }
]

UPDATE:
{
  _id: new ObjectId('...'),
  name: 'John Doe',
  email: 'jdoe@example.com',
  createdAt: ...,
  updatedAt: ...,
  __v: 0
}

DELETE:
{
  _id: new ObjectId('...'),
  name: 'John Doe',
  email: 'jdoe@example.com',
  createdAt: ...,
  updatedAt: ...,
  __v: 0
}
```