export default {
	namespaced: true,

	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),

	mutations: {
		addToCart(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// console.log(findResult);

			if (!findResult) {
				state.cart.push(goods)
			} else {
				findResult.goods_count++
			}

			this.commit('m_cart/saveToStorage')
			// console.log(state.cart);
		},
		// 持久化购物车数据到本地存储
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if (findResult) {
				findResult.goods_state = goods.goods_state
				this.commit('m_cart/saveToStorage')
			}
		},
		// 更新商品的数量
		updateGoodsCount(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_count = goods.goods_count
				this.commit('m_cart/saveToStorage')
			}
		},
		// 删除购物车商品
		removeGoodsById(state, goods_id) {
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			// filter方法创建一个 新 的数组，包含满足条件的所有元素
			this.commit('m_cart/saveToStorage')
		},
		// 更新购物车中所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			state.cart.forEach(x => x.goods_state = newState)
			this.commit('m_cart/saveToStorage')
		}
	},

	getters: {
		// 购物车商品总数量
		total(state) {
			// let c = 0
			// state.cart.forEach(goods => c += goods.goods_count)
			// return c

			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},

		// 购物车已勾选商品总数量
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state === true).reduce((total, item) => total += item.goods_count, 0)
		},
		// 已勾选商品总价
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state === true).reduce((total, item) => total += item.goods_count * item
				.goods_price, 0).toFixed(2)
		}
	}
}
