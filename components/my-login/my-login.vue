<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
		<text class="tips-text">登陆后尽享权益</text>
	</view>
</template>

<script>
	import {mapMutations, mapState} from 'vuex'
	export default {
		name:"my-login",
		data() {
			return {
				
			}
		},
		computed: {
			...mapState('m_user', ['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			getUserInfo() {
				uni.getUserProfile({
					desc: "获取用户数据",
					success: (res) => {
						console.log(res.userInfo);
						this.updateUserInfo(res.userInfo)
						
						this.getToken(res)
					},
					fail: () => {
						return uni.$showMsg('您取消了登录授权！')
					}
				})
			},
			async getToken(info) {
				// 获取code对应的值
				const [err, res] = await uni.login().catch(err => err)
				if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登陆失败')
				
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				
				/* const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin', query) */
				/* if(loginResult.meta.status !== 200) return uni.$showMsg('登陆失败！')
				uni.$showMsg('登陆成功！') */
				
				// 把token保存到vuex中
				this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
				this.navigateBack()
			},
			navigateBack() {
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.login-container {
	height: 750rpx;
	background-color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow: hidden;
	
	&::after {
		content: ' ';
		display: block;
		width: 100%;
		height: 40px;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #F8F8F8;
		border-radius: 100%;
		transform: translateY(50%);
		
	}
	.btn-login {
		width: 90%;
		border-radius: 100px;
		margin: 15px 0;
		background-color: #C00000;
	}
	
	.tips-text {
		font-size: 12px;
		color: gray;
	}
}
</style>