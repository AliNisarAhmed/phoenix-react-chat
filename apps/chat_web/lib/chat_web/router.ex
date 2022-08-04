defmodule ChatWeb.Router do
  use ChatWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {ChatWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", ChatWeb do
    pipe_through :api

    get "/rooms/:room_id", PrivateRoomController, :index
    post "/rooms", PrivateRoomController, :create
    post "/rooms/:room_id/topic", PrivateRoomController, :update_topic
    post "/rooms/invite", PrivateRoomController, :accept_invite
  end

  scope "/", ChatWeb do
    pipe_through :browser

    get "/", PageController, :index
    post "/rooms", PrivateRoomController, :create
    get "/*path", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", ChatWeb do
  #   pipe_through :api
  # end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
