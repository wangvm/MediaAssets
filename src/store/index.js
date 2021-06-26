import Vue from 'vue'
import Vuex from 'vuex'
import common from './common'
import edit from './edit'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		common,
		edit
	}
})
