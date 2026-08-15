function Header({ title, description }) {

    return (

        <header className="top-header">

            <div className="header-left">

                <p className="page-label">
                    MaintenX
                </p>

                <h1>
                    {title}
                </h1>

                <p className="header-description">
                    {description}
                </p>

            </div>


            <div className="header-right">

                <button className="notification-button">
                    🔔
                    <span className="notification-dot"></span>
                </button>


                <div className="user-profile">

                    <div className="avatar">
                        AT
                    </div>

                    <div className="user-information">

                        <strong>
                            Andi Teknisi
                        </strong>

                        <span>
                            Engineer
                        </span>

                    </div>

                </div>

            </div>

        </header>

    );
}

export default Header;