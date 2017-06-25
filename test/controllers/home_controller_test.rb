require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get base" do
    get home_base_url
    assert_response :success
  end

end
