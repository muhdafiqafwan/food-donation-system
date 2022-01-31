import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { AuthProvider } from "./context/auth";

import AuthRouteDonor from "./util/authDonor";
import AuthRouteDonor1 from "./util/authDonor1";
import DonorRegisterPage from "./pages/donor/DonorRegister";
import DonorLoginPage from "./pages/donor/DonorLogin";
import DonorHomePage from "./pages/donor/DonorHomePage";
import OrganizationDetails from "./pages/donor/OrganizationDetails";
import ProgramDetails from "./pages/donor/ProgramDetails";
import Donate from "./pages/donor/Donate";
import DonateHistory from "./pages/donor/DonateHistory";
import DonorProfile from "./pages/donor/DonorProfile";
import DonorUpdateProfile from "./pages/donor/DonorUpdateProfile";

import AuthRouteOrganization from "./util/authOrganization";
import OrganizationRegisterPage from "./pages/organization/OrganizationRegister";
import OrganizationLoginPage from "./pages/organization/OrganizationLogin";
import OrganizationDashboardPage from "./pages/organization/OrganizationDashboard";
import Program from "./pages/organization/Program";
import ProgramUpdate from "./pages/organization/ProgramUpdate";
import Details from "./pages/organization/Details";
import DonationApprove from "./pages/organization/DonationApprove";
import DonationReject from "./pages/organization/DonationReject";
import OrganizationProfile from "./pages/organization/OrganizationProfile";
import OrganizationUpdateProfile from "./pages/organization/OrganizationUpdateProfile";

import AuthRouteAdmin from "./util/authAdmin";
import AdminRegisterPage from "./pages/admin/AdminRegister";
import AdminLoginPage from "./pages/admin/AdminLogin";
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import AdminNGODetails from "./pages/admin/AdminNGODetails";
import AdminNGO from "./pages/admin/AdminNGO";
import AdminDonor from "./pages/admin/AdminDonor";
import AdminProgramDetails from "./pages/admin/AdminProgramDetails";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(
      ({ message, locations, path }) => (
        (window.gqlErrorMessage = message),
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = from([
  errorLink,
  new HttpLink({
    uri: "http://localhost:5000/graphql",
    credentials: "same-origin",
  }),
]);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <AuthRouteDonor1 path="/donorLogin" component={DonorLoginPage} />
            <Route path="/donorRegister" component={DonorRegisterPage} />
            <Route
              path="/organizationLogin"
              component={OrganizationLoginPage}
            />
            <Route
              path="/organizationRegister"
              component={OrganizationRegisterPage}
            />
            <Route path="/adminLogin" component={AdminLoginPage} />
            <Route path="/adminRegister" component={AdminRegisterPage} />

            <AuthRouteAdmin
              path="/adminDashboard"
              component={AdminDashboardPage}
            />
            <AuthRouteAdmin path="/adminNGO" component={AdminNGO} />
            <AuthRouteAdmin
              path="/ngoDetails/:id"
              component={AdminNGODetails}
            />
            <AuthRouteAdmin path="/adminDonor" component={AdminDonor} />
            <AuthRouteAdmin
              path="/adminProgramDetails/:id"
              component={AdminProgramDetails}
            />

            <AuthRouteDonor path="/donorHomepage" component={DonorHomePage} />
            <AuthRouteDonor path="/donorProfile/:id" component={DonorProfile} />
            <AuthRouteDonor
              path="/donorUpdateProfile/:id"
              component={DonorUpdateProfile}
            />
            <AuthRouteDonor
              path="/organizationDetails/:id"
              component={OrganizationDetails}
            />
            <AuthRouteDonor
              path="/programDetails/:id"
              component={ProgramDetails}
            />
            <AuthRouteDonor path="/donate/:id" component={Donate} />
            <AuthRouteDonor path="/donateHistory" component={DonateHistory} />

            <AuthRouteOrganization
              path="/organizationDashboard"
              component={OrganizationDashboardPage}
            />
            <AuthRouteOrganization
              path="/organizationProfile/:id"
              component={OrganizationProfile}
            />
            <AuthRouteOrganization
              path="/organizationUpdateProfile/:id"
              component={OrganizationUpdateProfile}
            />

            <AuthRouteOrganization path="/program" component={Program} />
            <AuthRouteOrganization path="/details/:id" component={Details} />
            <AuthRouteOrganization
              path="/programUpdate/:id"
              component={ProgramUpdate}
            />
            <AuthRouteOrganization
              path="/donationApprove/:id"
              component={DonationApprove}
            />
            <AuthRouteOrganization
              path="/donationReject/:id"
              component={DonationReject}
            />
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
