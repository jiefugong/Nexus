class EventsController < ApplicationController
  before_action :set_event, only: [:show, :edit, :update, :destroy]

  # GET /events
  # GET /events.json
  def index
    @events = Event.all
  end

  # GET /events/1
  # GET /events/1.json
  def show
    @event = Event.find_by(id: params[:id])
    render json: @event
  end

  # GET /events/new
  def new
    @event = Event.new
  end

  # GET /events/1/edit
  def edit
  end

  # POST /events
  # POST /events.json
  def create
    @event = Event.create(title: params[:title], description: params[:description], start_time: params[:start_time], end_time: params[:end_time])
    @allEvents = Event.all
    render json: @allEvents
  end

  # PATCH/PUT /events/1
  # PATCH/PUT /events/1.json
  def update
    @event.update(title: params[:title], description: params[:description], start_time: params[:start_time], end_time: params[:end_time])
    @allEvents = Event.all
    render json: @allEvents
  end

  # DELETE /events/1
  # DELETE /events/1.json
  def destroy
    @event.destroy
    @allEvents = Event.all
    respond_to do |format|
      format.json { render json: @allEvents }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_event
      @event = Event.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def event_params
      params.require(:event).permit(:title, :description, :start_time, :end_time)
    end
end
