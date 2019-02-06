<template>
  <button
    v-if="type === 'round'"
    :class="`button--${color}`"
    :disabled="disabled"
    class="button button-round"
  >
    <slot />
  </button>
  <button
    v-else-if="type === 'ellipse'"
    :class="`button--${color}`"
    :disabled="disabled"
    class="button button-ellipse"
  >
    <slot name="description" />
    <div class="button-ellipse-icon">
      <slot name="icon" />
    </div>
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      default: 'round',
      validator: value => ['round', 'ellipse'].includes(value)
    },

    color: {
      type: String,
      default: 'orange'
    }
  }
}
</script>

<style lang="scss">
$c-white: #fff;
$c-black: #000;

$c-black--light: #222223;
$c-black--dark: #141415;

$c-grey--light: #e9e9e9;

$c-graphite--dark: #333;

$c-primary-accent: #ff9a57;
$c-primary-accent--dark: #dd8346;

.button {
  transition: all 300ms ease-in-out;
  outline: none;
  cursor: pointer;

  &[disabled] {
    opacity: 0.3;
  }

  &-ellipse {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 3px 3px 3px 20px;
    font-size: 14px;
    letter-spacing: 0.5px;
    text-decoration: none;
    border: none;
    border-radius: 25px;
    color: $c-white;

    &-icon {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 36px;
      height: 36px;
      border-radius: 50%;

      margin-left: 15px;
      color: $c-white;
    }
  }

  &--black {
    background-color: $c-black--light;

    .button-ellipse-icon {
      color: $c-white;
      background-color: $c-black--dark;
    }
  }

  &--grey {
    color: $c-black;
    background-color: $c-grey--light;

    .button-ellipse-icon {
      color: $c-black;
      background-color: $c-white;
    }
  }

  &--dark-grey {
    color: $c-white;
    background-color: $c-graphite--dark;

    .button-ellipse-icon {
      color: $c-white;
      background-color: $c-graphite--dark;
    }
  }

  &--orange {
    background-color: $c-primary-accent;

    .button-ellipse-icon {
      color: $c-white;
      background-color: $c-primary-accent--dark;
    }

    &:hover {
      background-color: $c-primary-accent--dark;

    .button-ellipse-icon {
      background-color: $c-primary-accent;
    }
    }
  }

  &--white {
    color: $c-black--dark;
    background-color: $c-white;

    .button-ellipse-icon {
      color: $c-white;
      background-color: $c-primary-accent;
    }
  }
}

.button-ellipse-icon {
  transition: all 300ms ease-in-out;
}

.button-round {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40px;
  height: 40px;
  border-radius: 50%;

  text-decoration: none;
  border: none;

  svg {
    color: $c-white;
  }
}
</style>
