
const RegisterSuccess = () => {
    return(
        <section className="vh-90">
            <div className="container py-5 h-screen">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Please,check your e-mail!</h4>
                        <p>We have sent message for confirmation to your email, until then you may log in to your profile!</p>

                        <p>Link expires in 2 hourse!</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegisterSuccess;