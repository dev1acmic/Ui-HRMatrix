import React, { Component } from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../util/protectedRoute";
import UnprotectedRoute from "../util/unprotectedRoute";

// Views
import Auth from "../views/Auth/view";
import AgencyRegister from "../views/Auth/components/signUp/Agency";
import UnderDevelopment from "../views/UnderDevelopment";
import NotFound from "../views/NotFound";
import Verify from "../views/Verify";
import Reset from "../views/Verify/resetIndex";
//Protected Views
import Dashboard from "views/Dashboard";
import Search from "views/Search";
import Matrix from "views/Matrix";
import CandidateRecap from "views/CandidateRecap";
import InterviewAssessment from "views/InterviewAssessment";
import JobPost from "views/JobPost";
import SubmitJobMessage from "views/JobPost/submitJobMessage";
import TrackJob from "views/TrackJob";
import InviteRecruiter from "views/InviteProfile";
import ManageUser from "views/ManageUser";
import AddUser from "views/ManageUser/components/Add";
import ManageAgency from "views/ManageAgency";
import AddAgency from "views/ManageAgency/components/Add";
import ManagePremiumAgency from "views/ManagePremiumAgency";
import AddPremiumAgency from "views/ManagePremiumAgency/components/Add";
import ManageEmployer from "views/ManageEmployer";
import AddEmployer from "views/ManageEmployer/components/Add";
import ManageRecruiter from "views/ManageRecruiter";
import ManageSettings from "views/ManageSettings";
import AddRecruiter from "views/ManageRecruiter/components/Add";
import RouteContainer from "./routeContainer";
import ManageFirm from "views/ManageFirm";
import RecReview from "views/JobPost/ReviewDetail";
import SubmitJobApplMessage from "views/JobApplication/submitJobApplMessage";
import ReviewDetail from "views/JobApplication/ReviewDetail";
import JobApplication from "views/JobApplication";
import ChangePassword from "views/ChangePassword";
import Reports from "views/Reports";
import ScrollToTop from "./scrollToTop";
import Journey from "views/Journey";

export default class Routes extends Component {
  render() {
    return (
      <BrowserRouter basename="/">
        <RouteContainer>
          <ScrollToTop />

          <Switch>
            <Redirect exact from="/" to="/sign-in" />
            <UnprotectedRoute
              component={Auth}
              exact
              path="/sign-in/:token?/:agency?"
            />
            <UnprotectedRoute
              component={AgencyRegister}
              exact
              path="/agencysign-in"
            />
            <UnprotectedRoute
              component={UnderDevelopment}
              exact
              path="/under-development"
            />
            <UnprotectedRoute component={NotFound} exact path="/not-found" />
            <UnprotectedRoute
              component={Verify}
              exact
              path="/verify/:token/:reset?"
            />
            <UnprotectedRoute component={Reset} exact path="/reset/:token/" />
            {/* <UnprotectedRoute component={Reset} exact path="/reset/:token/" /> */}
            {/* protected routes */}
            <ProtectedRoute component={Dashboard} exact path="/rc/dashboard" />
            <ProtectedRoute
              component={Matrix}
              exact
              path="/rc/matrix/:jobPostId"
            />

            <ProtectedRoute
              component={Journey}
              exact
              path="/rc/candidate-journey/:jobPostId"
            />
            <ProtectedRoute
              component={CandidateRecap}
              exact
              path="/rc/recap/:jobPostId/:jobApplId?"
            />
            <ProtectedRoute
              component={InterviewAssessment}
              exact
              path="/rc/assessment/:jobApplId?/:level?"
            />
            <ProtectedRoute
              component={JobPost}
              exact
              path="/rc/job-post/:jobPostId?"
            />
            <ProtectedRoute
              component={SubmitJobApplMessage}
              exact
              path="/rc/thank-you"
            />
            <ProtectedRoute
              component={SubmitJobMessage}
              exact
              path="/rc/thankyou/:jobPostId?/:status?"
            />
            <ProtectedRoute
              component={InviteRecruiter}
              exact
              path="/rc/invite-recruiter/:jobPostId"
            />
            <ProtectedRoute
              component={RecReview}
              exact
              path="/rc/job-review/:jobPostId"
            />
            <ProtectedRoute
              component={JobApplication}
              exact
              path="/rc/job-application"
            />
            <ProtectedRoute
              component={ReviewDetail}
              exact
              path="/rc/job-application-review"
            />
            {/* <ProtectedRoute
              component={JobPost}
              exact
              path="/rc/track-job/:id"
            /> */}
            <ProtectedRoute component={TrackJob} exact path="/rc/track-job" />
            <ProtectedRoute component={Dashboard} exact path="/rc/dashboard" />
            <ProtectedRoute component={Search} exact path="/rc/search" />
            <ProtectedRoute
              component={ManageUser}
              exact
              path="/rc/manage-user"
            />
            <ProtectedRoute
              component={AddUser}
              exact
              path="/rc/manage-user/add-user"
            />
            <ProtectedRoute
              component={ManageAgency}
              exact
              path="/rc/manage-agency"
            />
            <ProtectedRoute
              component={AddAgency}
              exact
              path="/rc/manage-agency/add-agency"
            />
            <ProtectedRoute
              component={ManagePremiumAgency}
              exact
              path="/rc/manage-premium-agency"
            />
            <ProtectedRoute
              component={AddPremiumAgency}
              exact
              path="/rc/manage-premium-agency/add-premium-agency"
            />
            <ProtectedRoute
              component={ManageEmployer}
              exact
              path="/rc/manage-employer"
            />
            <ProtectedRoute
              component={AddEmployer}
              exact
              path="/rc/manage-employer/add-employer"
            />
            <ProtectedRoute
              component={ManageRecruiter}
              exact
              path="/rc/manage-recruiter"
            />
            <ProtectedRoute
              component={ManageSettings}
              exact
              path="/rc/manage-settings"
            />
            <ProtectedRoute
              component={AddRecruiter}
              exact
              path="/rc/manage-recruiter/add-recruiter"
            />
            <ProtectedRoute
              component={ManageFirm}
              exact
              path="/rc/manage-firm"
            />
            <ProtectedRoute
              component={ChangePassword}
              exact
              path="/rc/change-password"
            />

            <ProtectedRoute
              component={Reports}
              exact
              path="/rc/reports/:role?"
            />
            {/* <UnprotectedRoute component={AddRecruiter} exact path="/Managefirm/AddFirm" /> */}
            <Redirect to="/not-found" />
          </Switch>
        </RouteContainer>
      </BrowserRouter>
    );
  }
}

/* const jobPostRoutes = (
  <Switch>
    <ProtectedRoute component={Dashboard} exact path="/dashboard" />
    <ProtectedRoute component={JobPost} exact path="/job-post" />
  </Switch>
);

const publicRoutes = (
  <Switch>
    <Redirect exact from="/" to="/sign-in" />
    <UnprotectedRoute component={Auth} exact path="/sign-in" />
    <UnprotectedRoute component={UnderDevelopment} exact path="/under-development" />
    <UnprotectedRoute component={NotFound} exact path="/not-found" />
    <Redirect to="/not-found" />
  </Switch>
); */
