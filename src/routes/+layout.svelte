<script lang="ts">
	import authStore from '$stores/auth';
	import messageStore from '$stores/message';

	import { initFirebaseApp, auth } from '$lib/firebase';
	import { onAuthStateChanged, signOut } from 'firebase/auth';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		await initFirebaseApp();

		if (auth === null) {
			return;
		}

		onAuthStateChanged(auth, (user) => {
			authStore.set({
				isLoggedIn: user !== null,
				user,
				firebaseControlled: true
			});
		});
	});

	const logout = async () => {
		if (auth === null) {
			return;
		}
		try {
			await signOut(auth);
			await goto('/login');
		} catch (e) {
			console.error(e);
			messageStore.set({
				message: 'ログアウトに失敗しました。',
				type: 'error'
			});
		}
	};
</script>

<nav>
	<div class="nav-wrapper">
		<a href="/" class="brand-logo">Firebase Chat</a>
		<ul id="nav-mobile" class="right hide-on-med-and-down">
			{#if $authStore.firebaseControlled}
				{#if $authStore.isLoggedIn}
					<li id="user-name">
						{$authStore.user?.displayName}
					</li>
					<li>
						<a href="##" on:click={logout}>ログアウト</a>
					</li>
				{:else}
					<li><a href="/login">ログイン</a></li>
				{/if}
			{/if}
			<li><a href="/signup">アカウント作成</a></li>
		</ul>
	</div>
</nav>
<div class="container">
	{#if $messageStore.message !== null}
		<div
			class="card-panel lighten-4"
			class:red={$messageStore.type === 'error'}
			class:teal={$messageStore.type === 'info'}
		>
			{$messageStore.message}
		</div>
	{/if}
	<slot />
</div>

<style lang="scss">
	#user-name {
		padding: 0px 15px 0px 15px;
	}
	.brand-logo {
		padding-left: 15px;
	}
</style>