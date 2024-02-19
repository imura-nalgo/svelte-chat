<script lang="ts">
	import dayjs from 'dayjs';
	import type { Message } from '$interfaces/message';
	import authStore from '$stores/auth';

	export let value: Message | null = null;
	const loggingInUserUid = $authStore.user?.uid;
	const messageSenderUid = value?.sender.uid;
	const sentAt = dayjs(value?.sent_at).format('YYYY/MM/DD HH:mm');
</script>

<div id="message-wrapper" class:own-message={loggingInUserUid === messageSenderUid}>
	<div id="meta-area" class="row">
		<div id="name" class="col s6">{value?.sender.displayName}</div>
		<div id="timestamp" class="col s6">{sentAt}</div>
	</div>
	<div id="text">{value?.text}</div>
</div>

<style lang="scss">
	#text {
		white-space: pre-wrap;
	}
	#meta-area {
		margin-bottom: 0px;
	}
	#message-wrapper {
		width: fit-content;
		min-width: 220px;
		min-height: 50px;
		padding: 10px;
		margin: 0px 0px 15px 0px;
		border-radius: 7px;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
	}
	#name {
		color: gray;
		font-size: x-small;
	}
	#timestamp {
		color: gray;
		font-size: x-small;
		text-align: right;
	}
	.own-message {
		background-color: rgba(172, 255, 47, 0.644);
	}
</style>
