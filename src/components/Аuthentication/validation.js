export const validateFormData = (formData) => {
  const errors = {}

  /*if (!formData.name) {
    errors.name = 'Введите имя'
  }

  if (!formData.emailOrPhone) {
    errors.emailOrPhone = 'Введите email или телефон'
  }

  if (!formData.password) {
    errors.password = 'Введите пароль'
  }*/

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
  }

  return errors
}
