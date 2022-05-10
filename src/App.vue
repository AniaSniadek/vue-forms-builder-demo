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
    name: [null, [Validators.minLength(3), Validators.maxLength(10)]],
  })
);
const control = ref(FormBuilder.control(null));
const acceptAll = ref(false);

watch(acceptAll, () => {
  form.value.get('consent').patchValue({
    phoneContact: acceptAll.value,
    mailContact: acceptAll.value,
  });
});

const phoneValidationMsg = computed(() => {
  if (form.value.get('phone').touched) {
    switch (true) {
      case form.value.get('phone').error['required']: {
        return 'To pole jest wymagane';
      }
      case form.value.get('phone').error['pattern']: {
        return 'Niepoprawna wartość';
      }
      default: {
        return '';
      }
    }
  } else {
    return '';
  }
});

function onSumbit() {
  console.log(control.value);
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
      <input type="text" v-model="control.value" />
    </div>
    <div class="form__element">
      <input type="text" v-model="form.get('name').value" />
    </div>
    <div class="form__element">
      <input type="text" v-model="form.get('phone').value" />
      <span v-if="phoneValidationMsg" class="form-error">{{
        phoneValidationMsg
      }}</span>
    </div>
    <div class="form__element">
      <input type="text" v-model="form.get('price').value" />
    </div>
    <div class="form__element">
      <div>
        <input type="checkbox" v-model="acceptAll" />
        <label>Akceptuje wszystkie oświadczenia</label>
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
          >Zgadzam się na kontakt telefoniczny</label
        >
      </div>
      <div>
        <input
          type="checkbox"
          v-model="form.get('consent.mailContact').value"
        />
        <label>Zgadzam się na kontakt mailowy</label>
      </div>
    </div>
    <button type="submit">Wyślij</button>
  </form>
</template>

<style>
.form-error {
  color: red;
}
</style>
