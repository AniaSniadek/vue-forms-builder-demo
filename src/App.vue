<script setup>
import { ref, computed, watch } from 'vue';
import { FormBuilder, Validators } from 'vue-forms-builder';

const PHONE_PATTERN = new RegExp('^[0-9]{9,12}$');

const form = ref(
  FormBuilder.group({
    phone: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    consent: {
      phoneContact: [false, Validators.requiredTrue],
      mailContact: false,
    },
    price: [null, [Validators.min(0), Validators.max(100)]],
  })
);
const nameControl = ref(
  FormBuilder.control(null, [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(15),
  ])
);
const acceptAll = ref(false);

watch(acceptAll, () => {
  form.value.get('consent').patchValue({
    phoneContact: acceptAll.value,
    mailContact: acceptAll.value,
  });
});

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
    default: {
      return '';
    }
  }
});

const phoneValidationMsg = computed(() => {
  if (!form.value.get('phone').touched) return '';

  switch (true) {
    case form.value.get('phone').error['required']: {
      return 'This field is required';
    }
    case form.value.get('phone').error['pattern']: {
      return 'Invalid value';
    }
    default: {
      return '';
    }
  }
});

function onSumbit() {
  if (form.value.valid) {
    acceptAll.value = false;
    form.value.reset();
  } else {
    form.value.markAllAsTouched();
  }
}
</script>

<template>
  <form class="form" @submit.prevent="onSumbit">
    <div class="form__element">
      <input type="text" v-model="nameControl.value" placeholder="Name" />
      <span v-if="nameValidationMsg" class="form-error">{{
        nameValidationMsg
      }}</span>
    </div>
    <div class="form__element">
      <input
        type="text"
        v-model="form.get('phone').value"
        placeholder="Phone number"
      />
      <span v-if="phoneValidationMsg" class="form-error">{{
        phoneValidationMsg
      }}</span>
    </div>
    <div class="form__element">
      <input
        type="text"
        v-model="form.get('price').value"
        placeholder="Price"
      />
    </div>
    <div class="form__element">
      <div>
        <input type="checkbox" v-model="acceptAll" />
        <label> I accept all statements</label>
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
            'form-error'
          "
        >
          I agree to be contacted by phone</label
        >
      </div>
      <div>
        <input
          type="checkbox"
          v-model="form.get('consent.mailContact').value"
        />
        <label> I agree to be contacted by e-mail</label>
      </div>
    </div>
    <button type="submit">Send</button>
  </form>
</template>

<style>
.form-error {
  color: red;
}
</style>
