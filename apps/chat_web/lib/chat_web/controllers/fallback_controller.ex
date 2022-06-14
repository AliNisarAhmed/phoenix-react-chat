defmodule ChatWeb.FallbackController do
  use ChatWeb, :controller

  def call(conn, {:error, :unauthorized}) do
    conn
    |> put_status(401)
    |> put_view(ChatWeb.ErrorView)
    |> render("401.json")
  end

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(404)
    |> put_view(ChatWeb.ErrorView)
    |> render("404.json")
  end
end
