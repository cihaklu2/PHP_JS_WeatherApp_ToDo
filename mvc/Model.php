<?php
class Model
{
    public $string;
    const STRING_DEF = "Lukáš Čihák";
    private $step = 0;

    public function __construct(){
        $this->string = self::STRING_DEF;
    }
	public function get_nextstep() {
		if($this->step >= 1) {
			return 0;
		}
		return $this->step + 1;
	}

	public function get_data_for_output() {
		return (object)array(
			'nadpis' => $this->string,
			'dalsiKrok' => $this->get_nextstep()
			);
	}

	public function update_step($step) {
		$this->step = (int)$step;

		switch ($this->step) {
			case 0 :

               $this->string = "Krok 1";
                include 'ToDo/index.html';
				break;
			case 1 :
				$this->string = "Krok 2";
                include 'Weather/index.html';
				break;
				}
	}

	public function get_template() {
		return 'sablona.php';
	}

}
