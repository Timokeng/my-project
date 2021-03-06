// use as mixin
import qs from 'querystring'
import api from '@/lib/api'
import wxp from 'wxp'
import tip from '@/lib/tip'

export default {
    methods:{
        jump(path,type){            
            let url = `/pages/${path}/main`
            if(typeof type=='string'){
                url = `/pages/${path}/main?type=${type}`
            }
            if(typeof type === "object"){
                url = `/pages/${path}/main?${qs.stringify(type)}`
            }
            wx.navigateTo({
                url
            })
        },
        async login(){
            const { code } = await wxp.login()
            const res = await api.getToken(code)
            return new Promise((resolve,rej)=>{
                if(res.code){
                    tip.toast(res.message)
                    rej()
                } else {
                    wx.setStorageSync('token',res.data.token)
                    resolve()
                }
            })
        },
        async onGetUserInfo(data){
            const raw = JSON.parse(data.rawData)
            const res = await api.createAccount(raw);      
            if(!res.code){
                this.showAuthModal = false;
                raw.level = res.data.level;
                wx.setStorageSync('user-info',raw);
            }else {
                tip.toast(res.message)
            }
        },
    }
}