"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  restoreSession,
  validateSession,
} from "../../store/actions/authActions";
import {
  selectAuthValidationStatus,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsAuthLoading,
  selectSessionRestored,
} from "../../store/selectors/authSelectors";
import { LoadingState } from "./LoadingState";

export function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isRestored = useSelector(selectSessionRestored);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const isLoading = useSelector(selectIsAuthLoading);
  const validationStatus = useSelector(selectAuthValidationStatus);

  useEffect(() => {
    if (!isRestored) dispatch(restoreSession());
  }, [dispatch, isRestored]);

  useEffect(() => {
    if (isRestored && isAuthenticated && validationStatus === "idle") {
      dispatch(validateSession());
    }
  }, [dispatch, isAuthenticated, isRestored, validationStatus]);

  if (!isRestored || isLoading || (isAuthenticated && validationStatus === "idle")) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f3f2] p-5">
        <LoadingState
          className="w-full max-w-md"
          label="Verificando tu sesión…"
        />
      </main>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

