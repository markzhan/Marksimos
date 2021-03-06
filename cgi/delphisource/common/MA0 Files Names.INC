
{                                                                                                                            }
{                           D R A G O N   S I M U L A T I O N                                                                }
{                                                                                                                            }
{                                   Global Arrays                                                                            }
{                                                                                                                            }
Const
  ConfigurationFileName       = '_Config.';
  AllResultsFileName          = 'AllResults.';
  TeamsDecisionFileNames      : array[TCIndx] of String = ( 'Decisions_Team1.',
                                                            'Decisions_Team2.',
                                                            'Decisions_Team3.',
                                                            'Decisions_Team4.',
                                                            'Decisions_Team5.',
                                                            'Decisions_Team6.' );

  ExogenousFileName  : array[TSimulationVariant, TTargetMarket] of String 
                         = (( 'MA0 Exogenous.FMC0', 'MA0 Exogenous.FMC1', 'MA0 Exogenous.FMC2', 'MA0 Exogenous.FMC3' ),
                            ( 'MA0 Exogenous.D_G0', 'MA0 Exogenous.D_G1', 'MA0 Exogenous.D_G2', 'MA0 Exogenous.D_G3' ));

  ParametersFileName : array[TSimulationVariant, TTargetMarket] of String 
                         = (( 'MA0 Parameters.FMC0', 'MA0 Parameters.FMC1', 'MA0 Parameters.FMC2', 'MA0 Parameters.FMC3' ),
                            ( 'MA0 Parameters.D_G0', 'MA0 Parameters.D_G1', 'MA0 Parameters.D_G2', 'MA0 Parameters.D_G3' ));

  TraceFileExtension = '  Trace.XLS';

  LogFileExtension = '.LOG';



