<script setup>
import { ref, computed, watch } from 'vue';
import { FormBuilder, Validators } from 'vue-forms-builder';
import { CustomValidators } from './custom-validators/CustomValidators.js';

const PHONE_PATTERN = new RegExp('^[0-9]{9}$');

/**
 * Create form group using FormBuilder.
 * Inside we have controls with value and validators (optionaly).
 * We can also add form group inside
 */
const form = ref(
  FormBuilder.group({
    phone: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    consent: {
      phoneContact: [false, Validators.requiredTrue],
      mailContact: false,
    },
    age: [null, [Validators.min(0), Validators.max(100)]],
  })
);
/**
 * Create form control using FormBuilder.
 * Here we just need to add value and validators (optionaly)
 */
const nameControl = ref(
  FormBuilder.control(null, [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(15),
    CustomValidators.noWhiteSpace,
  ])
);

const acceptAll = ref(false);

/**
 * Watcher for listening on acceptAll value change.
 * We set our consent values based on the acceptAll value
 * and we are using patchValue method, so we can change it in our form
 */
watch(acceptAll, (value) => {
  form.value.get('consent').patchValue({
    phoneContact: value,
    mailContact: value,
  });
});

/**
 * Computed for listening if nameControl has any error if value changes.
 * Based on the given error, it returns the appropriate text value
 */
const nameValidationMsg = computed(() => {
  if (!nameControl.value.touched) return '';

  switch (true) {
    case nameControl.value.error['required']: {
      return 'This field is required';
    }
    case nameControl.value.error['minLength']: {
      return 'The given name is too short';
    }
    case nameControl.value.error['maxLength']: {
      return 'The given name is too long';
    }
    case nameControl.value.error['noWhiteSpace']: {
      return 'White space is not allowed';
    }
    default: {
      return '';
    }
  }
});

/**
 * Computed for listening if phone control has any error if value changes.
 * Based on the given error, it returns the appropriate text value
 */
const phoneValidationMsg = computed(() => {
  if (!form.value.get('phone').touched) return '';

  switch (true) {
    case form.value.get('phone').error['required']: {
      return 'This field is required';
    }
    case form.value.get('phone').error['pattern']: {
      return 'Invalid value - the number should only contain numbers';
    }
    default: {
      return '';
    }
  }
});

/**
 * Computed for listening if price control has any error if value changes.
 * Based on the given error, it returns the appropriate text value
 */
const ageValidationMsg = computed(() => {
  if (
    form.value.get('age').touched &&
    (form.value.get('age').error['min'] || form.value.get('age').error['max'])
  ) {
    return 'Invalid value - the age should be between 0 and 100';
  }
  return '';
});

/**
 * onSubmit() method check if form group and name control is valid
 * and if it is form group and name control are reset
 * if not markAllAsTouched() method is called to set all controls as touched
 * and check it validity
 */
function onSumbit() {
  if (nameControl.value.valid && form.value.valid) {
    acceptAll.value = false;
    nameControl.value.reset();
    form.value.reset();
  } else {
    nameControl.value.markAsTouched();
    form.value.markAllAsTouched();
  }
}
</script>

<template>
  <div class="app-template">
    <form class="form" @submit.prevent="onSumbit">
      <div class="form__element">
        <input
          class="form__element-input"
          type="text"
          v-model="nameControl.value"
          placeholder="NAME"
        />
        <div class="form__error">{{ nameValidationMsg }}</div>
      </div>
      <div class="form__element">
        <input
          class="form__element-input"
          type="text"
          v-model="form.get('phone').value"
          placeholder="PHONE NUMBER"
        />
        <div class="form__error">{{ phoneValidationMsg }}</div>
      </div>
      <div class="form__element">
        <input
          class="form__element-input"
          type="text"
          v-model="form.get('age').value"
          placeholder="AGE"
        />
        <div class="form__error">{{ ageValidationMsg }}</div>
      </div>
      <div class="form__element">
        <div>
          <input type="checkbox" v-model="acceptAll" />
          <label class="form__element-label"> I accept all statements</label>
        </div>
        <div>
          <input
            type="checkbox"
            v-model="form.get('consent.phoneContact').value"
          />
          <label
            :class="
              form.get('consent.phoneContact').touched &&
              form.get('consent.phoneContact').error['required'] &&
              'form__error-checkbox'
            "
            class="form__element-label"
          >
            I agree to be contacted by phone</label
          >
        </div>
        <div>
          <input
            type="checkbox"
            v-model="form.get('consent.mailContact').value"
          />
          <label class="form__element-label">
            I agree to be contacted by e-mail</label
          >
        </div>
      </div>
      <button class="form__button" type="submit">Send</button>
    </form>
  </div>
</template>

<style>
body {
  margin: 0;
  box-sizing: border-box;
  background-color: #f2f2f2;
}

.app-template {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-family: 'Roboto', sans-serif;
  align-items: center;
}

.form__error {
  font-size: 12px;
  text-align: right;
  padding: 5px 20px 0 20px;
  height: 20px;
  color: #c11f1f;
}

.form__element-input {
  width: 300px;
  display: block;
  height: 47px;
  padding: 0 24px;
  font-size: 13px;
  border: none;
  background: #fff;
  border-radius: 31px;
  color: #8f8fa1;
}

.form__element-label {
  color: #212529;
  font-size: 15px;
}

.form__error-checkbox {
  color: #c11f1f;
}

.form__button {
  border: none;
  width: 133px;
  height: 47px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #212529;
  font-size: 15px;
  color: #fff;
  box-shadow: 0 0 1px rgb(0 0 0 / 0%);
  margin-top: 20px;
}
</style>
