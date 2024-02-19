<script lang="ts">
	import authStore from '$stores/auth';
	import { onChildAdded } from 'firebase/database';
	import MessageComponent from '$components/Message.svelte';
	import type { Message, Sender } from '$interfaces/message';
	import { sendMessage, dbRef } from '$lib/firebase';
	import { afterUpdate, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import messageStore from '$stores/message';

	let isLoading: boolean = false;
	onMount(() => {
		isLoading = true;

		setTimeout(async () => {
			if (!$authStore.isLoggedIn) {
				await goto('/login');
			}

			if (dbRef === null) {
				return;
			}

			onChildAdded(dbRef, (snapshot) => {
				isLoading = true;

				const message: Message = snapshot.val();
				messages.push(message);
				messages = messages;

				isLoading = false;
			});
		}, 1500);
	});

	// 最新のメッセージを常に表示するために
	// 表示更新時に一番下までスクロールする。
	let msgWrapperElement: HTMLElement;
	afterUpdate(() => {
		msgWrapperElement.scrollTo(0, msgWrapperElement.scrollHeight);
	});

	let message: string | null = null;
	let messages: Message[] = [];
	const send = async () => {
		if (message === null) {
			return;
		}

		const sender: Sender = {
			displayName: $authStore.user?.displayName ?? '',
			uid: $authStore.user?.uid ?? ''
		};
		try {
			sendMessage(message, sender);
			message = null;
		} catch (e) {
			console.error(e);
			messageStore.set({
				message: 'メッセージの送信に失敗しました。',
				type: 'error'
			});
		}
	};
</script>

<div class="row">
	<div class="col s12">
		<div class="card">
			<div class="card-content">
				<div class="messages-wrapper" bind:this={msgWrapperElement}>
					<div class="messages-wrapper-inner">
						{#if isLoading}
							<div class="preloader-wrapper big active">
								<div class="spinner-layer spinner-blue-only">
									<div class="circle-clipper left">
										<div class="circle" />
									</div>
									<div class="gap-patch">
										<div class="circle" />
									</div>
									<div class="circle-clipper right">
										<div class="circle" />
									</div>
								</div>
							</div>
						{:else}
							{#each messages as m}
								<div class:own-message={$authStore.user?.uid === m.sender.uid}>
									<MessageComponent value={m} />
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<div class="card-action">
				<div id="message-area-wrapper" class="row">
					<div id="message-area" class="input-field col">
						<label for="chat-textarea">メッセージを入力</label>
						<textarea id="chat-textarea" class="materialize-textarea" bind:value={message} />
					</div>
					<div id="send-button" class="col">
						<button
							class="btn-large waves-effect waves-light"
							class:disabled={message === null}
							on:click={send}
						>
							送信
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
  #message-area-wrapper {
    display: flex;
    align-items: flex-end;
  }
  #message-area {
    width: calc(100% - 115px);
  }
  #send-button {
    margin-bottom: 30px;
  }
	.card-content {
		height: calc(100vh - 300px);
	}
	.messages-wrapper {
		height: 100%;
		padding: 10px 15px 10px 15px;
		overflow: auto;
	}
	.own-message {
		display: flex;
		justify-content: flex-end;
	}
</style>
