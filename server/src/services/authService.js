import { supabase } from "../config/supabaseClient.js";

export const signupUser = async ({ fullName, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    throw {
      statusCode: 400,
      message: error.message
    };
  }

  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw {
      statusCode: 401,
      message: error.message || "Invalid email or password"
    };
  }

  return data;
};

export const getUserFromToken = async (token) => {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    throw {
      statusCode: 401,
      message: "Invalid or expired token"
    };
  }

  return data.user;
};