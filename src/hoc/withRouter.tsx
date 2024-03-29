import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const withRouter = <CT,>(Component: React.ComponentType<CT>) => {
    let RouterComponent = (props: CT) => {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }} />
        );
    }

    return RouterComponent;
}