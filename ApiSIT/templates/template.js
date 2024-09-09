export const getEmailTemplate = (data) => {
  const { email, token } = data

  const emailUser = email.split('@')[0].toString()
  const url = 'https://'

  return `
    <form>
        <div>
            <h1>Restablecimiento de contraseña</h1>
            <label>Hola ${emailUser} </label>
            <br>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
            <a href="${url}?token=${token}" target="_blank"> Restaurar contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
        </div>
    </form>
  `
}
