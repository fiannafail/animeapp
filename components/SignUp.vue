<template>
	<div>
	  <form class="md-5" @submit.prevent="registerUser">
			<div class="form-group">
				<label for="login">Your Login</label>
				<input type="text" class="form-control" id="login" placeholder="Enter your Login" required v-model="user.displayName">
			</div>
	  	<div class="form-group">
	  		<label for="email">Your Email</label>
				<input type="email" class="form-control" id="email" placeholder="Enter your email" required v-model="user.email">
	  	</div>
			<div class="form-group">
				<label for="password">Your Password</label>
				<input type="password" class="form-control" id="password" placeholder="Enter password" required v-model="user.password">
			</div>
			<div class="alert alert-danger" role="alert" v-if="errorConfirm">
				<b>Oups!</b> Passwords do not match or was not entered.
			</div>
			<div class="alert alert-danger" role="alert" v-if="errorSmall">
				<b>Oups!</b> Passwords should contain at least 6 symbols.
			</div>
			<button type="submit" class="btn btn-primary" name="button">Sign Up</button>
	  </form>
		<div class="alert alert-success" role="alert" v-if="signSuccess">
			<b>Congrats!</b> You have been signed up.
		</div>
		<div class="alert alert-danger" role="alert" v-if="signError">
			<b>Oups!</b> Something went wrong.
		</div>
	</div>
</template>
<script>
export default {
  name: "sign-up",
  data() {
		return {
			errorConfirm: false,
			errorSmall: false,
			signSuccess: false,
			signError: false,
			user: {
				displayName: '',
				email: '',
				password: '',
			},
			error: false
		}
  },
	methods: {
		
		registerUser: function(){
			this.$store.dispatch('signUp', this.user )
		}
	},
	computed: {
		stateee(){
			console.log('user')
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					console.log(user)
				} else {
					// No user is signed in.
				}
			});
		}
}
}
</script>
<style lang="scss" scoped>
</style>
