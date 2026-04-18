<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	page {
		--background: #f8faf8;
		--surface: #f8faf8;
		--surface-bright: #f8faf8;
		--inverse-primary: #9dd76b;
		--outline: #727969;
		--surface-variant: #e1e3e1;
		--on-primary-fixed-variant: #285000;
		--on-surface: #191c1b;
		--surface-container-highest: #e1e3e1;
		--surface-container-high: #e6e9e7;
		--on-tertiary-fixed: #410005;
		--surface-container-lowest: #ffffff;
		--on-tertiary: #ffffff;
		--on-primary-fixed: #0d2000;
		--secondary: #8f4e00;
		--on-surface-variant: #42493a;
		--inverse-surface: #2e3130;
		--secondary-fixed-dim: #ffb77a;
		--primary: #396a05;
		--on-background: #191c1b;
		--on-error: #ffffff;
		--on-primary-container: #264c00;
		--on-tertiary-fixed-variant: #910719;
		--tertiary: #b3272e;
		--surface-dim: #d8dad9;
		--primary-container: #88c057;
		--secondary-container: #fc9d41;
		--tertiary-fixed: #ffdad7;
		--error-container: #ffdad6;
		--primary-fixed-dim: #9dd76b;
		--error: #ba1a1a;
		--inverse-on-surface: #eff1ef;
		--on-error-container: #93000a;
		--tertiary-fixed-dim: #ffb3af;
		--secondary-fixed: #ffdcc2;
		--on-secondary-fixed: #2e1500;
		--tertiary-container: #ff928d;
		--on-secondary: #ffffff;
		--outline-variant: #c2c9b6;
		--primary-fixed: #b8f484;
		--surface-tint: #396a05;
		--on-secondary-container: #6b3900;
		--on-secondary-fixed-variant: #6d3a00;
		--on-primary: #ffffff;
		--surface-container: #eceeec;
		--surface-container-low: #f2f4f2;
		--on-tertiary-container: #8c0217;

		--radius-default: 24rpx;
		--radius-lg: 48rpx;
		--radius-xl: 80rpx;
		--radius-full: 9999rpx;

		--font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

		font-family: var(--font-body);
		line-height: 1.4;
		font-weight: 400;
		color: var(--on-surface);
		background-color: var(--background);
		font-size: 30rpx;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 200rpx 0;
		box-sizing: border-box;
	}
</style>
