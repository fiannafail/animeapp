<template>
 <v-flex xs12>
			<v-card>
				<v-card-text>
					<v-layout row wrap align-center>
						<v-flex >
							<v-text-field hide-details type="text" class="input-alternate" id="form1" placeholder="Enter title you want to watch" v-model="query"></v-text-field>
						</v-flex>
	
							<v-btn dark color="primary" @click="search()" class="m-0">
								Search<v-icon dark right>fa-search</v-icon>
						</v-btn>
			
					</v-layout>
				</v-card-text>
			</v-card>
		
  </v-flex>
</template>
<script>
export default {
  name: "AnimeSearch",
	computed: {
		results() {
			return this.$store.getters.results
		}
	},
	methods: {
		search(){
			this.$store.dispatch('show')
			if(19 < this.results.length){
				this.$store.dispatch('hideButtons')
					this.$store.dispatch('findCommonValues', this.query).then(() => {
						
						this.$store.dispatch('showButtons')
						console.log('reload findCommonValues')
						this.$store.dispatch('getWatchings')
					})
			} else {
				this.$store.dispatch('findCommonValues', this.query).then(() => {
					
					this.$store.dispatch('showButtons')
					console.log('first request')
					console.log('there are not results')
					this.$store.dispatch('getWatchings')
				})
			}
		}
	},
  data () {
		return {
			query: ''
		}
  }
}
</script>
<style lang="scss" scoped>
#form1 {
	font-size: 15px !important;
}
</style>
