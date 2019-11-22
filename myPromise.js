function MyPromise(executor){
    let This = this;
    This.value="";
    This.reason="";
    This.state="pending";
    This.resolveCallbacks=[];
    This.rejectCallbacks=[];
    function resolve(value){
        This.value=value;
        This.state="fulfilled";
        This.resolveCallbacks.forEach((fun)=>fun())
    }
    function reject(reason){
        This.reason=reason;
        This.state="rejected";
        This.rejectCallbacks.forEach((fun)=>fun())
    }
    executor(resolve,reject)
}
MyPromise.prototype.then=function(onFulfilled, onRejected){
    let This=this;
    let _promise;
    _promise=new MyPromise((resolve,reject)=>{
        if(This.state=="pending"){
            This.resolveCallbacks.push(()=>{
                resolveFunction(_promise,resolve,reject)
            })
            This.rejectCallbacks.push(()=>{
                rejectFunction(_promise,resolve,reject)
            })
        }
        if(This.state=="fulfilled"){
            resolveFunction(_promise,resolve,reject)
        }
        if(This.state=="rejected"){
            rejectFunction(_promise,resolve,reject)
        }
    })
    function resolveFunction(promise,resolve,reject){
        let x=onFulfilled(This.value)
        resolvePromise(promise,x,resolve,reject)
    }
    function rejectFunction(promise,resolve,reject){
        let x=onRejected(This.reason)
        resolvePromise(promise,x,resolve,reject)
    }
    return _promise;
}
function resolvePromise(promise,x,resolve,reject){
    if(x!==null&&(typeof x==="object"||typeof x==="function")){ 
        let then=x.then;
        if(typeof then === "function"){
            then.call(x,y=>{
                resolvePromise(promise,y,resolve,reject)
            },err=>{
                reject(err)
            })
        }else{
            resolve(x)
            }
    }else{
        resolve(x)
    }
}

new MyPromise((resolve,reject)=>{
    console.log("promise1")
    resolve()
}).then(()=>{
    console.log("then11")
    new MyPromise((resolve,reject)=>{
        console.log("promise2")
        resolve()
    }).then(()=>{
        console.log("then21")
    }).then(()=>{
        console.log("then23")
    })
}).then(()=>{
    console.log("then12")
})
