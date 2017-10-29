<template>
  <v-card id="card">
		<v-card-title>
			<h5>{{ selectAnime.attributes.titles.en ? selectAnime.attributes.titles.en : selectAnime.attributes.titles.en_jp}}</h5>
		</v-card-title>
		<img :src="selectAnime.attributes.coverImage.original">
		<v-card-actions>
		<div class="row align-items-center mt-3">
			<star-rating :rating="selectAnime.attributes.averageRating / 10"
									 :max-rating="10"
									 class="col-8"
									 :read-only="true"
									 active-color="#f09804"
									 :star-size="21"
									 :increment="0.02"></star-rating>
			
		</div>
		</v-card-actions>
		<v-card-text>{{ selectAnime.attributes.synopsis}}</v-card-text>
  </v-card>
</template>
<script>
import StarRating from 'vue-star-rating';
export default {
	computed: {
		selectAnime() {
			return this.$store.state.selectAnime
		},
		AnimeArray() {
			return this.$store.state.AnimeArray
		},
		displayedFavorited() {
			return this.$store.state.displayedFavorited
		}
	},
  name: "animecard",
	props: ['post', 'selected'],
  data() {
		return {
			show: false
		}
  },
	methods: {
	  handleDown(index) {
			if (this.show === index)
	        this.show = false;
	    this.show = index;

	  }
	},
	components: {
	  StarRating
	}
}
</script>
<style lang="scss" scoped>
.list__tile {
	height: 54px;
}
	img {
		width: 100%;
	}
	span {
		color: black;
	}
	.rating-text {
		display: none;
	}
	.md-form label {
		top: 0;
	}
</style>
