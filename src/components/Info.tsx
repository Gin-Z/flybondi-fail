const Info = () => {
    return(
        <div className="card p-3 text-center">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Vuelo</th>
                        <th scope="col">Ruta</th>
                        <th scope="col">Hora programada</th>
                        <th scope="col">Hora real</th>
                        <th scope="col">Demora en despegar<i className="bi bi-arrow-down"></i></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>FO 5440</td>
                        <td>Córdoba → Bariloche</td>
                        <td>09:35</td>
                        <td></td>
                        <td><strong>Cancelado</strong></td>
                    </tr>
                    <tr>
                        <td>FO 5520</td>
                        <td>Córdoba → Neuquen</td>
                        <td>15:25</td>
                        <td>18:18</td>
                        <td><strong className="text-danger">2hs 53min tarde</strong></td>
                    </tr>
                    <tr>
                        <td>FO 5304</td>
                        <td>Aeroparque → Neuquen</td>
                        <td>18:55</td>
                        <td>13:36</td>
                        <td><strong className="text-success">Adelantado 5hs 19min</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default Info;