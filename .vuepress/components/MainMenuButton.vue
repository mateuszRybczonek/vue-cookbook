<template>
  <BaseButton
    @click.native="$router.push('/chapters/02-main-menu.html')"
    class="main-menu-button"
    type="ellipse"
  >
    <span slot="description">Main menu</span>
    <ArrowRight slot="icon" />
  </BaseButton>
</template>

<script>
import BaseButton from './BaseButton'
import ArrowRight from '../public/images/tail-right.svg?inline'

export default {
  components: {
    ArrowRight,
    BaseButton,
  },
}
</script>

<style lang="scss" scoped>
$c-white: #fff;
$c-primary-accent: #ff9a57;
$c-primary-accent--dark: #dd8346;

.main-menu-button {
  position: fixed;
  z-index: 9;
  bottom: 10px;
  right: 30px;
  max-width: 175px;
  align-self: flex-end;

  @media screen and (min-width: 992px) {
    bottom: 30px;
    right: auto;
    left: 90px;
  }
}
</style>
