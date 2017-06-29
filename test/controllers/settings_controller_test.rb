require 'test_helper'

class SettingsControllerTest < ActionDispatch::IntegrationTest
  test "should get base" do
    get settings_base_url
    assert_response :success
  end

end
